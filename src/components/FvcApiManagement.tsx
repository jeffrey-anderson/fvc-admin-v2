'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Season {
  RecordType: string;
  WebsiteOpenOn: string;
  FirstCheckinDate: string;
  LastCheckoutDate: string;
  OpenWelcomeMessage: string;
  ClosedThankYouMessage: string;
  OfficeHours: string;
  Announcements: string;
}

interface OutOfOffice {
  StartDate?: string;
  EndDate?: string;
  Title?: string;
  Details?: string;
  RecordType?: string;
  // Keep the lowercase versions for form handling
  startDate?: string;
  endDate?: string;
  title?: string;
  message?: string;
}

export default function FvcApiManagement() {
  const [season, setSeason] = useState<Season | null>(null);
  const [outOfOffice, setOutOfOffice] = useState<OutOfOffice | null>(null);
  const [loading, setLoading] = useState(false);
  const [editingSeason, setEditingSeason] = useState(false);
  const [editingOoo, setEditingOoo] = useState(false);
  const [seasonForm, setSeasonForm] = useState<Season>({
    RecordType: 'Season',
    WebsiteOpenOn: '',
    FirstCheckinDate: '',
    LastCheckoutDate: '',
    OpenWelcomeMessage: '',
    ClosedThankYouMessage: '',
    OfficeHours: '',
    Announcements: ''
  });
  const [oooForm, setOooForm] = useState<OutOfOffice>({ StartDate: '', EndDate: '', Details: '' });

  // Get the FVC API URL from environment variables
  const FVC_API_URL = process.env.NEXT_PUBLIC_FVC_API_URL || 'https://your-fvc-api-url.execute-api.us-east-2.amazonaws.com/Devl';
  
  console.log('FVC_API_URL:', FVC_API_URL);

  useEffect(() => {
    loadData();
  }, []);

  const getAuthToken = async () => {
    try {
      const { fetchAuthSession } = await import('aws-amplify/auth');
      const session = await fetchAuthSession();
      return session.tokens?.idToken?.toString();
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  const loadData = async () => {
    setLoading(true);
    try {
      await Promise.all([loadSeason(), loadOutOfOffice()]);
    } finally {
      setLoading(false);
    }
  };

  const loadSeason = async () => {
    try {
      console.log('Loading season from:', `${FVC_API_URL}/season`);
      const response = await fetch(`${FVC_API_URL}/season`);
      console.log('Season response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Season data received:', data);
        setSeason(data);
        setSeasonForm(data);
      } else if (response.status === 404) {
        console.log('No season data found (404)');
        setSeason(null);
        setSeasonForm({
          RecordType: 'Season',
          WebsiteOpenOn: '',
          FirstCheckinDate: '',
          LastCheckoutDate: '',
          OpenWelcomeMessage: '',
          ClosedThankYouMessage: '',
          OfficeHours: '',
          Announcements: ''
        });
      } else {
        console.error('Unexpected response status:', response.status);
        const errorText = await response.text();
        console.error('Error response:', errorText);
      }
    } catch (error) {
      console.error('Error loading season:', error);
    }
  };

  const loadOutOfOffice = async () => {
    try {
      console.log('Loading out-of-office from:', `${FVC_API_URL}/events/ooo`);
      const response = await fetch(`${FVC_API_URL}/events/ooo`);
      console.log('Out-of-office response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Out-of-office data received:', data);
        setOutOfOffice(data);
        setOooForm(data);
      } else if (response.status === 404) {
        console.log('No out-of-office data found (404)');
        setOutOfOffice(null);
        setOooForm({ StartDate: '', EndDate: '', Details: '' });
      } else {
        console.error('Unexpected out-of-office response status:', response.status);
        const errorText = await response.text();
        console.error('Out-of-office error response:', errorText);
      }
    } catch (error) {
      console.error('Error loading out of office:', error);
    }
  };

  const saveSeason = async () => {
    const token = await getAuthToken();
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${FVC_API_URL}/season`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(seasonForm)
      });

      if (response.ok) {
        setSeason(seasonForm);
        setEditingSeason(false);
        alert('Season updated successfully');
      } else {
        const error = await response.text();
        alert(`Error updating season: ${error}`);
      }
    } catch (error) {
      console.error('Error saving season:', error);
      alert('Error saving season');
    }
  };

  const saveOutOfOffice = async () => {
    const token = await getAuthToken();
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${FVC_API_URL}/events/ooo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(oooForm)
      });

      if (response.ok) {
        setOutOfOffice(oooForm);
        setEditingOoo(false);
        alert('Out of office updated successfully');
      } else {
        const error = await response.text();
        alert(`Error updating out of office: ${error}`);
      }
    } catch (error) {
      console.error('Error saving out of office:', error);
      alert('Error saving out of office');
    }
  };

  const deleteOutOfOffice = async () => {
    if (!confirm('Are you sure you want to delete the out of office period?')) {
      return;
    }

    const token = await getAuthToken();
    if (!token) {
      alert('Authentication required');
      return;
    }

    try {
      const response = await fetch(`${FVC_API_URL}/events/ooo`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setOutOfOffice(null);
        setOooForm({ StartDate: '', EndDate: '', Details: '' });
        alert('Out of office deleted successfully');
      } else {
        const error = await response.text();
        alert(`Error deleting out of office: ${error}`);
      }
    } catch (error) {
      console.error('Error deleting out of office:', error);
      alert('Error deleting out of office');
    }
  };

  return (
    <div className="space-y-6">
      {/* Season Management */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Season Configuration
            </h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-gray-500">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Text fields support&nbsp;</span>
                <a 
                  href="https://markdowncheatsheet.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500 underline"
                >
                  Markdown formatting
                </a>
              </div>
              <button
                onClick={loadSeason}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Refresh
              </button>
              {season && !editingSeason && (
                <button
                  onClick={() => setEditingSeason(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Edit Season
                </button>
              )}
            </div>
          </div>

          {season ? (
            editingSeason ? (
              // Edit Form
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Website Opens On</label>
                    <input
                      type="datetime-local"
                      value={seasonForm.WebsiteOpenOn ? new Date(seasonForm.WebsiteOpenOn).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setSeasonForm({ ...seasonForm, WebsiteOpenOn: new Date(e.target.value).toISOString() })}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Check-in Date</label>
                    <input
                      type="datetime-local"
                      value={seasonForm.FirstCheckinDate ? new Date(seasonForm.FirstCheckinDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setSeasonForm({ ...seasonForm, FirstCheckinDate: new Date(e.target.value).toISOString() })}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Check-out Date</label>
                    <input
                      type="datetime-local"
                      value={seasonForm.LastCheckoutDate ? new Date(seasonForm.LastCheckoutDate).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setSeasonForm({ ...seasonForm, LastCheckoutDate: new Date(e.target.value).toISOString() })}
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Open Welcome Message</label>
                  <textarea
                    rows={6}
                    value={seasonForm.OpenWelcomeMessage}
                    onChange={(e) => setSeasonForm({ ...seasonForm, OpenWelcomeMessage: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Message displayed when the website is open for reservations (supports Markdown formatting)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Closed Thank You Message</label>
                  <textarea
                    rows={6}
                    value={seasonForm.ClosedThankYouMessage}
                    onChange={(e) => setSeasonForm({ ...seasonForm, ClosedThankYouMessage: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Message displayed when the website is closed for reservations (supports Markdown formatting)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
                  <textarea
                    rows={4}
                    value={seasonForm.OfficeHours}
                    onChange={(e) => setSeasonForm({ ...seasonForm, OfficeHours: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Office hours information (supports Markdown formatting)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Announcements</label>
                  <textarea
                    rows={3}
                    value={seasonForm.Announcements}
                    onChange={(e) => setSeasonForm({ ...seasonForm, Announcements: e.target.value })}
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Current announcements (supports Markdown formatting)"
                  />
                </div>

                <div className="flex space-x-3 pt-4 border-t">
                  <button
                    onClick={saveSeason}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingSeason(false);
                      setSeasonForm(season);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Read-only View
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Website Opens</h4>
                    <p className="text-lg text-gray-700">
                      {new Date(season.WebsiteOpenOn).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">First Check-in</h4>
                    <p className="text-lg text-gray-700">
                      {new Date(season.FirstCheckinDate).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Last Check-out</h4>
                    <p className="text-lg text-gray-700">
                      {new Date(season.LastCheckoutDate).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Open Welcome Message</h4>
                  <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                    <ReactMarkdown>{season.OpenWelcomeMessage}</ReactMarkdown>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Closed Thank You Message</h4>
                  <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                    <ReactMarkdown>{season.ClosedThankYouMessage}</ReactMarkdown>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Office Hours</h4>
                    <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                      <ReactMarkdown>{season.OfficeHours}</ReactMarkdown>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Announcements</h4>
                    <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                      <ReactMarkdown>{season.Announcements}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">No Season Data Found</h4>
              <p className="text-gray-600 mb-4">There should always be exactly one season record. Create the initial season configuration.</p>
              <button
                onClick={() => setEditingSeason(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Create Season Record
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Out of Office Management */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Out of Office Management
            </h3>
            <button
              onClick={loadOutOfOffice}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Refresh
            </button>
          </div>

          {editingOoo ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                  <input
                    type="datetime-local"
                    value={(() => {
                      try {
                        if (!oooForm.StartDate) return '';
                        const date = new Date(oooForm.StartDate);
                        if (isNaN(date.getTime())) return '';
                        // Convert UTC date to local datetime-local format
                        // Subtract timezone offset to get local time
                        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                        return localDate.toISOString().slice(0, 16);
                      } catch (error) {
                        console.error('Error parsing start date:', oooForm.StartDate, error);
                        return '';
                      }
                    })()}
                    onChange={(e) => {
                      if (e.target.value) {
                        // datetime-local gives us local time, but we need to store as UTC
                        // Create date in local timezone, then convert to ISO string
                        const localDate = new Date(e.target.value);
                        setOooForm({ ...oooForm, StartDate: localDate.toISOString() });
                      } else {
                        setOooForm({ ...oooForm, StartDate: '' });
                      }
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                  <input
                    type="datetime-local"
                    value={(() => {
                      try {
                        if (!oooForm.EndDate) return '';
                        const date = new Date(oooForm.EndDate);
                        if (isNaN(date.getTime())) return '';
                        // Convert UTC date to local datetime-local format
                        // Subtract timezone offset to get local time
                        const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                        return localDate.toISOString().slice(0, 16);
                      } catch (error) {
                        console.error('Error parsing end date:', oooForm.EndDate, error);
                        return '';
                      }
                    })()}
                    onChange={(e) => {
                      if (e.target.value) {
                        // datetime-local gives us local time, but we need to store as UTC
                        // Create date in local timezone, then convert to ISO string
                        const localDate = new Date(e.target.value);
                        setOooForm({ ...oooForm, EndDate: localDate.toISOString() });
                      } else {
                        setOooForm({ ...oooForm, EndDate: '' });
                      }
                    }}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Out of Office Message</label>
                <textarea
                  rows={3}
                  value={oooForm.Details || ''}
                  onChange={(e) => setOooForm({ ...oooForm, Details: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Message to display when the office is closed (supports Markdown formatting)"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={saveOutOfOffice}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save Out of Office
                </button>
                <button
                  onClick={() => {
                    setEditingOoo(false);
                    setOooForm(outOfOffice || { StartDate: '', EndDate: '', Details: '' });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div>
              {outOfOffice ? (
                <div className="bg-gray-50 rounded-md p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Current Out of Office</p>
                      <p className="text-lg font-medium text-gray-900 mb-3">
                        {(() => {
                          try {
                            const startDate = new Date(outOfOffice.StartDate || '');
                            const endDate = new Date(outOfOffice.EndDate || '');
                            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                              return `${outOfOffice.StartDate} - ${outOfOffice.EndDate} (Raw dates - check format)`;
                            }
                            return `${startDate.toLocaleString()} - ${endDate.toLocaleString()}`;
                          } catch (error) {
                            return `Error parsing dates: ${outOfOffice.StartDate} - ${outOfOffice.EndDate}`;
                          }
                        })()}
                      </p>
                      {outOfOffice.Details && (
                        <div className="text-sm text-gray-700 prose prose-sm max-w-none">
                          <ReactMarkdown>{outOfOffice.Details}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingOoo(true)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={deleteOutOfOffice}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 mb-4">No out of office period set</p>
                  <button
                    onClick={() => {
                      setEditingOoo(true);
                      setOooForm({ StartDate: '', EndDate: '', Details: '' });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Set Out of Office
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-sm text-gray-600">Loading...</span>
        </div>
      )}
    </div>
  );
}